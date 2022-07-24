import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { Home } from './pages';
import { sidebarNavs, routes } from './routes';

const App = () => (
  <HashRouter>
    <Layout sidebar={{ navs: sidebarNavs }}>
      <Routes>
        {routes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Layout>
  </HashRouter>
);

export default App;
