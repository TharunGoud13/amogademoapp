import Contacts from "@/components/chat/contacts";

export const metadata = {
  title: 'Chat',
  description: 'Chat application built using the components.'
};

const Home = async () => {
  return (
    <div className="z-10 py-5 pt-0 rounded-lg w-full   text-sm lg:flex">
      <Contacts />
    </div>
  );
}

export default Home;