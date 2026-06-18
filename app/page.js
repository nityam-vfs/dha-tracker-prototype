import Header from "@/components/Header";
import LoginForm from "@/components/LoginForm";

export default function HomePage() {
  return (
    <>
      <Header showAuth={false} />

      <main className="container">
        <section className="hero">
          <h1>Track Your DHA Visa Application</h1>
          <p>
            Stay informed at every step. Securely check the real-time status of
            your application submitted through VFS Global.
          </p>
          <div className="hero-cta">
            <a className="btn btn-accent" href="#login">
              Track Your Application
            </a>
          </div>
        </section>

        <section className="features">
          <div className="feature">
            <div className="feature-icon">🔎</div>
            <h3>Real-time Status</h3>
            <p>
              Instantly see whether your application is under process, approved,
              or rejected.
            </p>
          </div>
          <div className="feature">
            <div className="feature-icon">🔒</div>
            <h3>Secure Access</h3>
            <p>
              Email + OTP verification keeps your application details private and
              protected.
            </p>
          </div>
          <div className="feature">
            <div className="feature-icon">⚡</div>
            <h3>Fast & Simple</h3>
            <p>
              Subscribers view status instantly; paid users unlock access in a
              few clicks.
            </p>
          </div>
        </section>

        <section id="login">
          <LoginForm />
        </section>
      </main>

      <footer className="footer">
        © {new Date().getFullYear()} VFS Global — DHA Application Tracker
        (Prototype)
      </footer>
    </>
  );
}
