export default function Header() {
  return (
    <>
      <nav>
        <a href="#about">About</a>
        <a href="#skills">Skills</a>
        <a href="#projects">Projects</a>
        <a href="#experience">Experience</a>
        <a href="#contact">Contact</a>
      </nav>

      <header className="hero">
        <h1>Houssem Mbarki</h1>

        <p>DevOps Master Student</p>

        <a href="#contact" className="btn">
          Contact Me
        </a>
      </header>
    </>
  );
}