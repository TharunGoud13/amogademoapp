"use client"
import { FC } from "react";
import { redirect } from "next/navigation";



const Home:FC = () => {
  const userSession = localStorage.getItem('user');

  const handleLogout = ():FC => {
    localStorage.removeItem('user');
    redirect('/sigin')
  }





  return (
    <div>
      <h1>AmogademoApp</h1>
      <p>Welcome to the Amogademo App!</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Home;