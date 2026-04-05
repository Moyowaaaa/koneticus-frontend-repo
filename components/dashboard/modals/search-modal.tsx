import Modal from "@/components/ui-components/modal";
import { Input } from "@/components/ui/input";
import { useSearchStore } from "@/store/useSearchStore";
import { SearchNormal } from "iconsax-reactjs";

const SearchModal = () => {
  const { setShowSearch, searchQuery, setSearchQuery, showSearch } =
    useSearchStore();
  return (
    <Modal
      className="bg-[transparent]!"
      containerClassname="bg-[transparent]!  flex flex-col gap-4 bg-none! "
      open={showSearch}
      onOpenChange={setShowSearch}
    >
      {/* <div>SearchModal</div> */}

      <div
        className="relative bg-white p-4 
            dark:bg-[#151515]
      
      rounded-[1.875rem] border-2 border-primary"
      >
        {/* <div className="rounded-full bg-gradient-to-r from-[#7F5CFF] via-[#6A7BFF] to-[#5FE0FF] shadow-[0_0_30px_rgba(111,102,255,0.45)]"> */}
        <div
          className="
          
            dark:bg-[#151515]
          flex items-center gap-3 rounded-full bg-white "
        >
          <SearchNormal size={20} color="#8C8C8C" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            className="border-none shadow-none focus-visible:ring-0 text-base text-brand-black dark:text-white
            dark:bg-[#151515]
            placeholder:text-brand-grey"
          />
        </div>
        {/* </div> */}
        <div
          className="absolute
            border-2 
          shadow-[0_0_30px_rgba(111,102,255,0.45)]
          dark:shadow-[none]
          dark:hidden
          inset-0 blur-3xl bg-gradient-to-r from-[#7F5CFF]/30 via-transparent to-[#5FE0FF]/20
          
          
          dark:bg-[#151515]
          pointer-events-none"
        />
      </div>

      <div
        className="w-full h-[30rem] bg-white rounded-[1.875rem]  
            dark:bg-[#151515]
      
      relative  mt-10"
      ></div>
    </Modal>
  );
};

export default SearchModal;
