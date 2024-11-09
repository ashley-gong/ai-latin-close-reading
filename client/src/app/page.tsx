import {Navbar, NavbarBrand} from "@nextui-org/react";
import NearestNeighborQuery from "./components/NearestNeighborQuery";

export default function Home() {

  return (
    <div className="grid items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-16 font-[family-name:var(--font-geist-sans)]">
      <Navbar position="static" className="items-start justify-start">
        <NavbarBrand>
          <h1 className="font-bold text-2xl text-inherit">AI Intertextuality Search</h1>
        </NavbarBrand>
      </Navbar>
      <main className="flex flex-row row-start-2 items-start sm:items-start gap-4 w-full">
        {/* <div className="w-4/5">
          <PassageViewContent />
        </div>
        <div className="w-1/5">
          <NearestNeighborQuery />
        </div> */}
        <NearestNeighborQuery />
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <p>Last updated 2024 by Ashley Gong.</p>
      </footer>
    </div>
  );
}
