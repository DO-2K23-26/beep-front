import { motion } from 'framer-motion'

export interface ServerCardProps {
  name: string
  description: string
  icon?: string
  banner?: string
  joinServer: () => void
}

export default function ServerCard({
  name,
  description,
  icon,
  banner,
  joinServer,
}: ServerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col group hover:cursor-pointer relative h-fit"
      onClick={joinServer}
    >
      <div className=" w-full h-[200px] rounded-3xl relative flex align-center justify-center">
        {banner ? (
          <div className="group-hover:translate-y-3 group-hover:scale-110 transition-all duration-300 w-full h-full group-hover:w-[90%] ease-in-out">
            <img
              src={banner}
              alt="Server banner"
              className="w-full h-full object-cover rounded-3xl bg-violet-400 relative z-10 opacity-100"
            />
            <img
              src={banner}
              alt="Server banner"
              className="object-cover rounded-3xl bg-violet-400 absolute left-0 top-0 blur-lg w-full h-full z-0 opacity-100 saturate-150"
            />
          </div>
        ) : (
          <div className="w-full h-full bg-violet-400 rounded-3xl" />
        )}
      </div>
      <section className="flex flex-col gap-2 p-4 -translate-y-16 relative z-10 group-hover:translate-y-[-4.25rem] transition-all duration-300 ease-in-out">
        <img
          src={icon}
          alt="Server icon"
          className="w-20 h-20 rounded-xl object-cover border-2 border-violet-200 bg-violet-400 group-hover:scale-110 transition-all duration-300 ease-in-out"
        />
        <h4 className="font-bold text-md">{name}</h4>
        <p className="text-xs opacity-70 truncate">{description}</p>
      </section>
    </motion.div>
  )
}
