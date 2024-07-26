import Groups from "@/components/chat/groups";

export const metadata = {
  title: 'Groups',
  description: 'Group Chat.'
};

const Home = async () => {
  return (
    <div className="z-10 py-5 rounded-lg w-full  text-sm lg:flex">
      <Groups />
    </div>
  );
}

export default Home;