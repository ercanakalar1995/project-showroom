import Main from '../src/components/Main';
import { GeneratedContext } from '../src/components/Contexts';

import { getCookie } from 'cookies-next';
import jwt from 'jsonwebtoken';
import Users from '../models/Users';
import Profiles from '../models/Profiles';
import Projects from '../models/Projects';
import connect from '../lib/database';
import LinkNext from 'next/link';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  pleaseLogIn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '20vh',
  },
  pleaseLogInLink: {
    color: 'white',
    fontSize: '2rem',
    fontWeight: 'bold',
    letterSpacing: '0.2rem',
    backgroundColor: 'black',
    padding: '1rem',
  },
}));

const PUBLIC_URL = process.env.NEXT_PUBLIC_URL;

export default function IndexPage(props) {
  const classes = useStyles();
  const { currentProfileStr, currentUserStr, projectsStr } = props;

  if (!currentUserStr) {
    return (
      <div className={classes.pleaseLogIn}>
        <LinkNext href={PUBLIC_URL + '/ercan-akalar9137'} passHref>
          <Link className={classes.pleaseLogInLink}>
            EXAMPLE PROJECT GALLERY | Ercan AKALAR
          </Link>
        </LinkNext>
      </div>
    );
  }

  return (
    <GeneratedContext.Provider>
      <Main
        currentUserStr={currentUserStr}
        currentProfileStr={currentProfileStr}
        projectsStr={projectsStr}
      />
    </GeneratedContext.Provider>
  );
}

const notActualObject = {
  id: 'B1XGMZMmY',
  projectTitle: 'Mapty',
  thumbnailUrl: '/assets/thumbnails/Mapty.png',
  description: 'To learn OOP, Geolocation & Project planning',
  skillTags: [''],
  leftButtonTitle: 'View Online',
  leftButtonUrl: 'https://mapty.netlify.app/',
  rightButtonTitle: 'View Codes',
  rightButtonUrl:
    'https://github.com/emremutlu08/complete-javascript-course-master-main',
  createdAt: 1631879690979,
};
const notActualProjects = {
  success: false,
  data: [notActualObject, notActualObject, notActualObject, notActualObject],
  message: 'Waiting...',
  loading: true,
};

IndexPage.defaultProps = {
  notActualProjects,
};

export async function getServerSideProps({ req, res }) {
  await connect();

  const token = getCookie('token', { req, res });
  // if (!token)
  //   return {
  //     redirect: {
  //       destination: '/',
  //     },
  //   };

  const verified = jwt.decode(token);

  const currentUser = await Users.findOne({ _id: verified?.id });
  const profile = await Profiles.findOne({ creatorId: verified?.id });
  const projects = await Projects.find({ creatorId: verified?.id });

  const currentUserStr = currentUser ? JSON.stringify(currentUser) : null;
  const currentProfileStr = profile ? JSON.stringify(profile) : null;
  const projectsStr = projects ? JSON.stringify(projects) : null;

  return {
    props: { currentUserStr, currentProfileStr, projectsStr },
  };
}
