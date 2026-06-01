import { Outlet } from "react-router";
import NavHeader from "../components/Navbar";
import { Container, Alert } from "react-bootstrap";

function DefaultLayout({ loggedIn, user, handleLogout, message, setMessage }) {

  const handleCloseAlert = () => setMessage?.(null);

  return (
    <>
      <NavHeader loggedIn={loggedIn} user={user} handleLogout={handleLogout} />

      <Container fluid className="mt-4 px-4 pb-4">

        {message && (<Alert variant={message.type || "info"} onClose={handleCloseAlert}
            dismissible className="mb-3">
            {message.msg}
          </Alert>
        )}

        <Outlet/>

      </Container>
    </>
  );
}

export default DefaultLayout;