import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoginForm from "@/components/LoginForm";

export default function HomePage() {
  return (
    <div className="login-page">
      <Header showAuth={false} />

      <main className="login-main">
        <LoginForm />
      </main>

      <Footer />
    </div>
  );
}
