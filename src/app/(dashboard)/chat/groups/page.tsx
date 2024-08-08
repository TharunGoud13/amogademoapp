import { auth } from "@/auth";
import Contacts from "@/components/chat/contacts";
import Groups from "@/components/chat/groups";

export const metadata = {
  title: 'Chat',
  description: 'Chat application built using the components.'
};

const Home = async () => {
  return (
    <div className="z-10 py-5 rounded-lg w-full  text-sm lg:flex">
      <Groups />
    </div>
  );
}

export default Home;