
import { ReactNode } from "react"
import { Navbar } from "../_components/landing/navbar";
const Layout = ({ children }: { children: ReactNode }) => {

  return (
    <>
      <Navbar />
      {children}
    </>
  )
}

export default Layout