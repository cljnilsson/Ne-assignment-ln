import { useState } from "react";
import {postRequest} from "../../Utils/RequestHelper";

function Login() {
	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");
    const [isWaiting, setIsWaiting] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

	async function login() {
        setIsWaiting(true);

		const url = "/api/login";
        const resp = await postRequest(url, {username, password});
        if(resp?.success) {
            window.location.href = "/";
            setPassword("");
            setError(""); // Unsure if this is necessary
        } else {
            setError(resp?.message || "An error occurred");
        }
		setIsWaiting(false);
    }

    function ErrorBox() {
        if(error === "") {
            return null;

        }

        return (
            <div className="alert alert-danger" role="alert">
                {error}
            </div>
        );
    }

	return (
		<div className="row justify-content-center">
			<div className="col-xl-4 col-10 bg-dark text-light rounded shadow mt-5">
				<h3 className="text-center my-3">Login please!</h3>
                <ErrorBox />
				<div className="input-group mb-3">
					<input
						type="text"
						className="form-control"
						placeholder="Username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
					<input
						type="password"
						className="form-control"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
				<button
					className="my-3 btn btn-lg btn-outline-light"
					onClick={login}
                    disabled={isWaiting}
				>
					{isWaiting ? (
						<div
							className="spinner-border text-primary"
							role="status"
						>
							<span className="visually-hidden">Loading...</span>
						</div>
					) : (
						"Login"
					)}
				</button>
			</div>
		</div>
	);
}

export default Login;
