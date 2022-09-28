import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Page } from 'src/constant/Page';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>BI-LL 分帳！</h1>
      <Button variant="contained" onClick={() => navigate(Page.Book)}>
        START
      </Button>
    </div>
  );
};

export default Landing;
