import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-16 font-sans">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            Discover Amazing Stories
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Explore insightful articles, tutorials, and stories from our
            community of writers
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none mx-auto">
          <h1>About BlogSpace</h1>
          <p>
            Welcome to BlogSpace, your go-to platform for sharing and
            discovering amazing stories. Our community of writers is dedicated
            to providing you with insightful articles, tutorials, and personal
            experiences that inspire and inform.
          </p>

        </div>
      </main>

      <Footer />
    </div>
  );
}
