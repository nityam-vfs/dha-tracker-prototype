import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoginForm from "@/components/LoginForm";

export default function HomePage() {
  return (
    <>
      <Header showAuth={false} />

      <main className="container-narrow">
        <LoginForm />
      </main>

      <Footer />
    </>
  );
}
