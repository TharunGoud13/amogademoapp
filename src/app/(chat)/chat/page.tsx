import Contacts from "@/components/chat/contacts";

export const metadata = {
  title: 'Chat',
  description: 'Chat application built using the components.'
};

const Home = async () => {
  return (
    <div className="z-10 py-10 rounded-lg w-full h-full text-sm lg:flex">
      <Contacts />
    </div>
  );
}

export default Home;