import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import logo from '../../assets/logo/logoBlanco.png';
import useAuthStore from "../../stores/authStore"

const MySwal = withReactContent(Swal);

function Login() {
    const {
        email,
        setEmail,
        password,
        setPassword,
        login,
        loading,
    } = useAuthStore();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigate = useNavigate();
    

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const success = await login();
        if (success) {
            navigate('/admin');
        } else {
            MySwal.fire({
                icon: "error",
                title: "Error",
                text: "Usuario o contraseña incorrectos",
            });
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.logo}>
                <img src={logo} alt="Witralen" />
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    type="email"
                    id="email"
                    className={styles.input}
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <div className={styles.passwordContainer}>
                    <input
                        type={passwordVisible ? "text" : "password"}
                        id="password"
                        className={styles.input}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="button"
                        className={styles.showPasswordButton}
                        onClick={togglePasswordVisibility}
                    >
                        {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
                <a href="/forgot-password" className={styles.forgotPassword}>
                    ¿Olvidaste tu contraseña?
                </a>
                <button type="submit" className={styles.loginButton}>
                {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </button>
            </form>
        </div>
    );
}

export default Login;
