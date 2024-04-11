import ProgressBar from 'react-bootstrap/ProgressBar';

function ProgressingBar() {
  const now = 60;
  return <ProgressBar now={now} label={`${now}%`} visuallyHidden />;
}

export default ProgressingBar;