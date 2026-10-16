
import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";

import BlogDetails from "./BlogDetails";
import Contact from "./Contact";
import Login from "./Login";
import Register from "./Register";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;

function Home() {
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  // Logged-in username from localStorage
  const [username, setUsername] = useState(
    () => localStorage.getItem("username") || ""
  );

  // Logout function
  function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");

    setUsername("");
  }

  // Fetch portfolio data
  useEffect(() => {
    async function fetchData() {
      try {
        const [
          skillsResponse,
          projectsResponse,
          postsResponse,
        ] = await Promise.all([
          fetch(`${API_URL}/skills/`),
          fetch(`${API_URL}/projects/`),
          fetch(`${API_URL}/posts/`),
        ]);

        if (
          !skillsResponse.ok ||
          !projectsResponse.ok ||
          !postsResponse.ok
        ) {
          throw new Error("Could not load portfolio data.");
        }

        const [skillsData, projectsData, postsData] =
          await Promise.all([
            skillsResponse.json(),
            projectsResponse.json(),
            postsResponse.json(),
          ]);

        setSkills(skillsData.results ?? skillsData);
        setProjects(projectsData.results ?? projectsData);
        setPosts(postsData.results ?? postsData);
        setError("");
      } catch {
        setError(
          "Backend data could not be loaded. Please check the Django server."
        );
      }
    }

    fetchData();
  }, []);

  return (
    <>
      <nav>
        <h2>
          <Link to="/">DevFolio</Link>
        </h2>

        <div>
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#blog">Blog</a>
          <a href="#contact">Contact</a>

          {username ? (
            <>
              <span>Welcome, {username}</span>

              <button
                type="button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login/">Login</Link>
              <Link to="/register/">Register</Link>
            </>
          )}
        </div>
      </nav>

      <section id="home">
        <p>Hello, I'm</p>
        <h1>Dhrubo Jyoti Roy Shaown</h1>
        <h2>Full Stack Web Developer</h2>
        <p>
          I build modern websites using React, Django, and Python.
        </p>
        <a href="#projects">View My Projects</a>
      </section>

      <section id="about">
        <h2>About Me</h2>
        <p>
          I am a Computer Science and Engineering graduate
          passionate about web development and AI.
        </p>
      </section>

      <section id="skills">
        <h2>My Skills</h2>

        {error ? (
          <p>{error}</p>
        ) : skills.length > 0 ? (
          skills.map((skill) => (
            <span key={skill.id}>{skill.name} </span>
          ))
        ) : (
          <p>No skills added yet.</p>
        )}
      </section>

      <section id="projects">
        <h2>My Projects</h2>

        {error ? (
          <p>{error}</p>
        ) : projects.length > 0 ? (
          projects.map((project) => (
            <article key={project.id}>
              <h3>{project.title}</h3>
              <p>{project.description}</p>

              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
              )}

              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {" "}Live Demo
                </a>
              )}
            </article>
          ))
        ) : (
          <p>No projects added yet.</p>
        )}
      </section>

      <section id="blog">
        <h2>Latest Blog Posts</h2>

        {error ? (
          <p>{error}</p>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <article key={post.id}>
              <h3>
                <Link to={`/blog/${post.slug}/`}>
                  {post.title}
                </Link>
              </h3>

              <p>{post.excerpt}</p>

              <Link to={`/blog/${post.slug}/`}>
                Read More →
              </Link>
            </article>
          ))
        ) : (
          <p>No blog posts added yet.</p>
        )}
      </section>

      <Contact />

      <footer>
        <p>© 2026 DevFolio. All rights reserved.</p>
      </footer>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/blog/:slug/"
          element={<BlogDetails />}
        />
        <Route path="/login/" element={<Login />} />
        <Route path="/register/" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
