// utils/chat/messageUtils.tsx
import React from "react";
import { parseHtml } from "../formmaters";
import { ChatMessage, Participant } from "../types/chat";
export const MENTION_TOKEN_REGEX = /@\[(.+?)\]\(user:([^)]+)\)/g;

export const resolveTaggedUsers = (
  msg: ChatMessage,
  participants: Participant[] = []
): { id: string; name: string }[] => {
  const users: { id: string; name: string }[] = [];

  if (Array.isArray(msg?.mentions) && msg.mentions.length) {
    msg.mentions.forEach((m) => users.push({ id: m.user_id, name: m.display }));
    return users;
  }

  if (Array.isArray(msg?.tag_user) && msg.tag_user.length) {
    msg.tag_user.forEach((tid) => {
      const found =
        participants.find(
          (p) => p?.member_id_encrpt === tid || p?.member_id === tid
        ) || null;
      if (found) {
        users.push({ id: tid, name: found.member_name || "Unknown" });
      } else {
        const text = String(msg?.message || "");
        const match = text.match(/^@([A-Za-z0-9 _.-]{1,50})$/);
        const fallbackName = match ? match[1] : "Unknown";
        users.push({ id: tid, name: fallbackName });
      }
    });
    return users;
  }

  return [];
};

const allIdsFor = (p: Participant): string[] =>
  [p?.member_id_encrpt, p?.member_id].filter(Boolean).map((x) => String(x));

/** escape a string for RegExp */
const escapeForRegex = (s: string = "") =>
  s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const renderMessageContent = (
  msg: ChatMessage,
  participants: Participant[] = []
) => {
  const rawText = String(msg?.raw_message ?? msg?.message ?? "");

  const tagUsers: string[] = Array.isArray(msg?.tag_user)
    ? msg.tag_user.map((t) => String(t))
    : [];

  const participantsById = new Map<string, Participant>();
  const participantsByName = new Map<string, Participant>();

  participants.forEach((p) => {
    if (!p) return;
    const id = p?.member_id_encrpt ?? p?.member_id;
    if (id) participantsById.set(String(id), p);
    if (p?.member_name) {
      participantsByName.set(String(p.member_name).trim().toLowerCase(), p);
    }
  });

  const taggedNames = tagUsers
    .map((tid) => {
      const p = participantsById.get(String(tid));
      return p ? String(p.member_name || "").trim() : null;
    })
    .filter(Boolean);

  const taggedNamesLower = Array.from(
    new Set(taggedNames.map((n) => n?.toLowerCase()))
  );
  const taggedNamesForRegex = taggedNamesLower.map(escapeForRegex);

  // remove tokenized mentions
  let cleaned = rawText.replace(MENTION_TOKEN_REGEX, (full, display, id) => {
    if (tagUsers.some((t) => String(t) === String(id))) {
      return "";
    }
    return `@${display}`;
  });

  if (taggedNamesForRegex.length > 0) {
    const namesGroup = taggedNamesForRegex.join("|");
    const atRegex = new RegExp(
      `(^|\\s)@(${namesGroup})(?=\\s|$|[.,!?;:])`,
      "gi"
    );

    cleaned = cleaned.replace(atRegex, (match, before) => before || "");
  }

  const normalized = cleaned.replace(/\s{2,}/g, " ").trim();

  return <div>{parseHtml(normalized)}</div>;
};

export const MAX_LENGTH = 120;

export const COLORS = Object.freeze({
  mine: "#556B2F",
  theirs: "#1E2A1E",
  text: "#E0E0E0",
  muted: "#8A9188",
  brass: "#B49E69",
});

export const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const getPreviewText = (renderedElement) => {
  try {
    const children = renderedElement?.props?.children;
    if (typeof children === "string") return children;
    if (Array.isArray(children)) {
      return children
        .map((c) => (typeof c === "string" ? c : c?.props?.children ?? ""))
        .join("");
    }
    return String(renderedElement);
  } catch {
    return String(renderedElement);
  }
};

export const isRecent = (dateString, seconds = 30) => {
  try {
    const diff = Date.now() - new Date(dateString).getTime();
    return diff / 1000 <= seconds;
  } catch {
    return false;
  }
};
export const safeString = (value) => (typeof value === "string" ? value : "");

export function htmlToPlainAndRaw(html: string) {
  const div = document.createElement("div");
  div.innerHTML = html;

  const mentions: { user_id: string; display: string }[] = [];
  div.querySelectorAll("span[data-mention='true']").forEach((chip) => {
    const name = chip.textContent?.replace(/^@/, "") || "";
    const id = chip.getAttribute("data-user-id") || "";
    mentions.push({ user_id: id, display: name });
    const token = document.createTextNode(`@[${name}](user:${id})`);
    chip.replaceWith(token);
  });

  const raw_message = div.textContent || "";

  const plainDiv = document.createElement("div");
  plainDiv.innerHTML = html;
  plainDiv.querySelectorAll("span[data-mention='true']").forEach((chip) => {
    const name = chip.textContent || "";
    chip.replaceWith(document.createTextNode(name));
  });
  const message = plainDiv.textContent || "";

  return {
    message: message.trim(),
    raw_message: raw_message.trim(),
    mentions,
  };
}
export default {
  MENTION_TOKEN_REGEX,
  resolveTaggedUsers,
  renderMessageContent,
  getInitials,
  getPreviewText,
  safeString,
  isRecent,
  htmlToPlainAndRaw,
  COLORS,
  MAX_LENGTH,
};
