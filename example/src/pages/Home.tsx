import { Link, Typography } from '@mui/material';
import { gitHubLink } from '../links';

const Home = () => (
  <div style={{ width: '80vw' }}>
    <Typography variant="h6" align="center">
      Site with examples of components based on "react-easy-infinite-scroll-hook"
    </Typography>
    <Typography style={{ marginTop: 20 }} align="center">
      Includes most of the components used, but is not limited to them.
    </Typography>
    <Typography align="center">
      Since this hook can add infinite scroll functionality in any direction, the components you can create are only up
      to your imagination.
    </Typography>
    <Typography style={{ marginTop: 20 }} align="center">
      Good luck with creating infinite scroll components!
    </Typography>
    <Typography align="center">
      If you like this project I will be glad if you put a star on the{' '}
      <Link target="_blank" href={gitHubLink} rel="noreferrer noopener">
        github page
      </Link>
      .
    </Typography>
  </div>
);

export default Home;
