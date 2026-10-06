import { UserIcon } from "lucide-react";
import { memo, useState } from "react";
import { Link, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion";


const Header = () => {

    const location = useLocation();
    const [showNav, setShowNav] = useState(false);

    const pages = [
        {
            name : "Home",
            path : "/"
        },
        {
            name : "Quotes",
            path : "/quotes"
        },
        {
            name : "Explore",
            path : "/explore"
        },
        {
            name : "Learn",
            path : "/learn"
        },
        {
            name : "Quizzes",
            path : "/quizzes"
        },
        {
            name : "Hermes AI",
            path : "/hermes-ai"
        },
        {
            name : "Favorites",
            path : "/favorites"
        },
        {
            name : "Profile",
            path : "/user"
        }
    ]
    return(
        <>
        <header className="flex flex-row justify-between w-full items-center h-[70px] bg-[#F7F1E3] px-4
        text-[#3E3025] shadow-2xl top-0 fixed z-50
        ">
            <Link to='/' className="text-[2em]  font-['Playfair_Display'] font-bold">
               Ancient Wisdom
            </Link>

            <nav className="flex flex-wrap justify-center items-center gap-4 max-[1000px]:hidden">
                {pages.map((p,i)=>{
                    return(
                        <Link to={p.path} key={i} 
                        style={{
                            fontSize : location.pathname === p.path ? "17px" : "15px",
                            fontWeight : location.pathname === p.path ? "1000" : "500",

                        }}
                        className="text-[#3E3025] font-[500] hover:text-[#A67C52] transition-colors duration-300">
                            {p.name === "Profile" ? <UserIcon size={30}/> : p.name}
                        </Link>
                    )
                })}
            </nav>

            {/* Mobile hamburger */}
        <button
          className="
            hidden max-[1000px]:flex
            w-10 h-10
            items-center justify-center
            cursor-pointer
          "
          onClick={() => setShowNav((prev) => !prev)}
          aria-label="Ouvrir le menu"
        >
          <motion.div
            animate={showNav ? "open" : "closed"}
            className="relative w-7 h-6"
          >
            <motion.span
              className="absolute left-0 top-0 w-7 h-[2px] bg-[#3E3025] rounded"
              variants={{
                closed: { rotate: 0, y: 0 },
                open: { rotate: 45, y: 10 },
              }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              className="absolute left-0 top-[10px] w-7 h-[2px] bg-[#3E3025] rounded"
              variants={{
                closed: { opacity: 1, x: 0 },
                open: { opacity: 0, x: -10 },
              }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="absolute left-0 top-[20px] w-7 h-[2px] bg-[#3E3025] rounded"
              variants={{
                closed: { rotate: 0, y: 0 },
                open: { rotate: -45, y: -10 },
              }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </button>
        </header>

              {/* Mobile navigation */}
             
      <AnimatePresence>
        {showNav && (
          <motion.nav
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="
              hidden max-[1000px]:flex
              flex-col
              fixed top-[70px] left-0
              w-full
              bg-[#F7F1E3]
              text-[#3E3025]
              z-40
              p-5
              gap-1
              shadow-xl
              border-t border-[#cdad7d]/10
            "
          >
            {pages.map((p, index) => {
              const isActive = location.pathname === p.path;

              return (
                <motion.div
                  key={p.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.07, duration: 0.25 }}
                >
                  <Link
                    to={p.path}
                    onClick={() => setShowNav(false)}
                    className={`
                      flex items-center justify-between
                      cursor-pointer px-3 py-3 rounded-[5px]
                      transition-colors duration-200
                      
                      ${
                        isActive
                          ? "bg-[#cdad7d]/10 text-[#cdad7d] font-semibold"
                          : "text-[#3E3025] font-medium hover:bg-white/5"
                      }
                    `}
                  >
                    {p.name}
                    {isActive && <span className="w-[6px] h-[6px] rounded-full bg-[#cdad7d]" />}
                  </Link>
                </motion.div>
              );
            })}

            
          </motion.nav>
        )}
      </AnimatePresence>
      </>
    )
}

export default memo(Header);