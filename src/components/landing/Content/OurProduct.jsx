import { LiaLongArrowAltRightSolid } from "react-icons/lia";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import product1 from "../../../assets/landing/product1.png"
import product2 from "../../../assets/landing/product2.png"
import product3 from "../../../assets/landing/product3.png"
import productTags from "../../../assets/landing/product-tags.png"

function OurProduct() {
  const [deleteText, setDeleteText] = useState(false);


  const scrollRef = useRef(null);

  const screenVariants = {
    hidden: { y: 150, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { delay: 0.1, duration: 0.3 } },
  };

  const imgVariants = {
    slidehidden: { y: -20, opacity: 0 },
    slidevisible: { x: 0, opacity: 1, transition: { delay: 0.2, duration: 1 } },
  };

  const imgtwoVariants = {
    slidehidden: { y: 20, opacity: 0 },
    slidevisible: { x: 0, opacity: 1, transition: { delay: 0.2, duration: 1 } },
  };

  const textVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { delay: 0.2, duration: 0.9 } },
  };

  const buttonsVariants = {
    hover: {
      scale: [1.1, 1, 1.1, 1],
      boxShadow: "0px 0px 8px rgb(164, 245, 24)",
      backgroundColor: ["rgba(164, 245, 24, 0.03)", "rgb(164, 245, 24)", "rgba(255, 255, 255, 0)"],
      transition: { duration: 0.6 },
    },
  };

  return (
    <motion.div className="relative bg-linear-gradienttwo font-[poppins] px-4 md:px-10">
      {/* Animated Text */}
      <AnimatePresence>
        <motion.div
          className="hidden md:block absolute top-1/2 -translate-y-1/2 m-auto text-[20vw] lg:text-[250px] text-stone-600 font-bold opacity-10 z-0 rotate-[-90deg] pointer-events-none"
          initial={{ opacity: 0, scale: 0.8, rotate: 90 }}
          animate={{ opacity: 0.1, scale: 1, rotate: 90, transition: { duration: 1 } }}
        >
          DEFCOMM
        </motion.div>
      </AnimatePresence>


      <div className="pb-6">
        <motion.div className="mb-2" ref={scrollRef} variants={screenVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <h1 className="mx-auto text-center pt-10 font-bold text-[24px] md:text-[40px] text-white z-10">
            Security Beyond Encryption
          </h1>
          <p className="max-w-[600px] mx-auto text-center text-sm md:text-[16px] md:mt-2 text-gray-400 leading-6 z-10">
            AI Defcomm, we develop and implement advanced encryption solutions that safeguard communications across all defense channels.
          </p>
        </motion.div>

        {/* Product Sections */}
        {[
          {
            title: "Military | Government | Intel Agency",
            subtitle: "Security-First Hardware",
            price: "Read More",
            content:
              "In an era where cyber threats are constantly evolving, having a secure foundation is more critical than ever. Our security-first hardware provides uncompromising protection, ensuring data integrity, privacy, and resilience against threats. From military operations to government agencies, our hardware is trusted to deliver unmatched security.",
            imgVariant: imgVariants,
            image: product1
          },
          {
            title: "Secure, Scalable, and Mission-Ready",
            subtitle: "Cloud-based Defcomm System",
            price: "Explore More",
            content:
              "The Cloud-Based Defcomm System is a next-generation secure communications platform designed for military, government, and industries. Built on high-assurance encryption and advanced cybersecurity protocols, it enables seamless, real-time communication across distributed teams—anytime, anywhere.",
            imgVariant: imgtwoVariants,
            image: product2
          },
          {
            title: "Cutting-edge technology for mobile communication.",
            subtitle: "Empowering Elite Team Comm",
            price: "Read More",
            imgVariant: imgVariants,
            image: product3
          },
        ].map((product, index) => (
          <div key={index} className={`flex flex-col ${index % 2 !== 0 ? "md:flex-row-reverse" : "md:flex-row"} py-6 md:py-10 z-10`}>
            <motion.div
              className="w-full h-[300px] md:h-[400px] rounded-lg relative"
              variants={product.imgVariant}
              initial="slidehidden"
              whileInView="slidevisible"
              viewport={{ once: true }}
            >
              <img src={product?.image} alt="" className="h-full mx-auto" />
              {index === 0 && <img src={productTags} alt="" className=" mx-auto absolute top-[2%] right-[2%] z-0 -skew-x-[5deg]" />}
            </motion.div>
            <div className="flex flex-col justify-center w-full p-4 md:pl-10">
              <motion.div className="text-white text-center md:text-left" variants={textVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <h1 className="text-lime-400 text-[18px] md:text-xl">{product.title}</h1>
                <h2 className="font-bold py-2 text-2xl md:text-3xl lg:text-4xl capitalize">{product.subtitle}</h2>
                <p className="text-sm md:text-[15px] !font-thin mt-2 md:mt-4 text-gray-400 leading-6">
                  {product?.content || (
                    <ul className="list-disc pl-4 w-max text-left mx-auto md:mx-0">
                      <li>Unbreakable Security</li>
                      <li>Zero Trust Architecture</li>
                      <li>Cross-Platform Compatibility</li>
                      <li>Tamper Detection & Integrity</li>
                    </ul>
                  )}
                </p>
                <motion.div
                  className="py-2 px-6 rounded-full w-max text-center mt-6 md:mt-8 text-lime-400 border border-lime-400 cursor-pointer mx-auto md:mx-0"
                  variants={buttonsVariants}
                  whileHover="hover"
                >
                  {product.price}
                </motion.div>
              </motion.div>
            </div>
          </div>
        ))}

        {/* View More Button */}
        <motion.div
          className="flex gap-2 items-center justify-center mx-auto py-2 px-4 md:px-6 rounded-full w-max text-center my-4 md:my-8 text-black bg-lime-400 border border-lime-400 cursor-pointer z-10"
          whileHover="hover"
        >
          View More <LiaLongArrowAltRightSolid />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default OurProduct;
