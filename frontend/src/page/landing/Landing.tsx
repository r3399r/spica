import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import H1 from 'src/component/typography/H1';
import H2 from 'src/component/typography/H2';
import H3 from 'src/component/typography/H3';
import H4 from 'src/component/typography/H4';
import H5 from 'src/component/typography/H5';
import H6 from 'src/component/typography/H6';
import { Page } from 'src/constant/Page';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div>
      <H1>BI-LL 分帳 landing page！</H1>
      <H2>h2 heading 2</H2>
      <H3>h3 heading 3</H3>
      <H4>h4 heading 4</H4>
      <H5>h5 heading 5</H5>
      <H6>h6 heading 6</H6>
      <Button variant="contained" onClick={() => navigate(Page.Book)}>
        START
      </Button>
    </div>
  );
};

export default Landing;
