import { useNavigate } from 'react-router-dom';

function Profile({ setUser }) {

  const navigate = useNavigate();
  
  function handleSignOut() {
    // clear session data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');

    // reset user state in React
    setUser(null);

    // redirect to login page
    navigate('/');
  }
  return (
    <div className='w-screen h-screen'>

    <div className='h-full flex justify-center items-center'>

      
    <button
      onClick={handleSignOut}
      className="bg-red-500 text-white px-4 py-4 rounded-md hover:bg-red-600 border-0 justify-center items-center text-5xl"
      >
      Sign Out
    </button>
        </div>
      </div>
  );
}

export default Profile;
