import SearchContext from "../Context/SearchContext";
import UserContext from "../Context/UserContext";
import { postRequest } from "../Utils/RequestHelper";
import { useContext } from "react";
import { Link } from "react-router-dom";

function Nav() {
	const { searchString, setSearchString } = useContext(SearchContext);
	const { username, setUsername } = useContext(UserContext);

	async function logout() {
		const resp = await postRequest("/api/logout", {});
		if(resp?.success) {
			// TokenCookie is automatically deleted by the server
			setUsername("");
		}
	}

	function LoginButton() {
		if (username.length > 0) {
			return <div className="ms-auto text-light"><span>{username}</span><button className="btn btn-light ms-2" onClick={logout}>Logout</button></div>
		}

		return (
			<div className="ms-auto">
				<Link className="" to="/login">
					<button className="btn btn-light">Login</button>
				</Link>
			</div>
		);
	}

	return (
		<nav className="navbar navbar-expand-lg navbar-dark bg-dark">
			<div className="container-fluid">
				<Link className="navbar-brand ms-5" to="/">
					NE Bookstore
				</Link>
				<input
					className="form-control mx-5 w-50"
					type="search"
					placeholder="Search"
					aria-label="Search"
					value={searchString}
					onChange={(e) => setSearchString(e.target.value)}
				/>
				<LoginButton />
			</div>
		</nav>
	);
}

export default Nav;
