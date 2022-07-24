import { Link } from '@mui/material';
import InfinityLogo from '../images/infinity-emoji.png';
import { gitHubLink, npmLink } from '../links';

const links = [
  {
    url: gitHubLink,
    label: 'GitHub',
  },
  {
    url: npmLink,
    label: 'npm',
  },
];

const Header = () => (
  <header className="App-header">
    <span className="App-header-content">
      <img className="App-logo" src={InfinityLogo} alt="♾️" />
      <Link href="#" color="inherit" variant="body1" fontWeight="bold" underline="none">
        react-easy-infinite-scroll-hook
      </Link>
    </span>
    <span className="App-header-content">
      {links.map(({ label, url }) => (
        <Link
          key={label}
          className="App-link"
          target="_blank"
          href={url}
          rel="noreferrer noopener"
          color="inherit"
          variant="body2"
        >
          {label}
        </Link>
      ))}
    </span>
  </header>
);

export default Header;
