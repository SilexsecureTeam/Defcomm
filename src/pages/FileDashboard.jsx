import React, { useEffect } from 'react';
import DashCards from '../components/fileManager/DashCards';
import PendingFileInvites from '../components/fileManager/PendingFileInvites';
import useGroups from "../hooks/useGroup";
import useFileManager from '../hooks/useFileManager';

const FileDashboard = () => {
  const { useFetchPendingFiles, useFetchGroups } = useGroups();
  const { data: filesPending, isLoading } = useFetchPendingFiles();

  // Fetch myFiles and loading state from file manager
  const { myFiles, isFetching: myFilesLoading, refetchMyFiles } = useFileManager();
    const { data: groups, isLoading:isGroupLoading } = useFetchGroups();
  // Trigger refetch on mount
  useEffect(() => {
    refetchMyFiles(); // This will trigger the refetch whenever this component is mounted
  }, []);

  return (
    <div>
      {/* Passing files and loading state to DashCards */}
      <DashCards files={myFiles} groups={groups} loading={myFilesLoading} />
      {/* Passing filesPending and loading state to PendingFileInvites */}
      <PendingFileInvites invites={filesPending} loading={isLoading} />
    </div>
  );
};

export default FileDashboard;
