import { useNavigate } from 'react-router-dom';
import Button from 'src/celestial-ui/Button';
import H1 from 'src/celestial-ui/typography/H1';
import H2 from 'src/celestial-ui/typography/H2';
import H3 from 'src/celestial-ui/typography/H3';
import H4 from 'src/celestial-ui/typography/H4';
import H5 from 'src/celestial-ui/typography/H5';
import H6 from 'src/celestial-ui/typography/H6';
import { Page } from 'src/constant/Page';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div>
      <H1>h1 Heading 1 標題 1</H1>
      <H2>h2 heading 2 標題 2</H2>
      <H3>h3 heading 3 標題 3</H3>
      <H4>h4 heading 4 標題 4</H4>
      <H5>h5 heading 5 標題 5</H5>
      <H6>h6 heading 6 標題 6</H6>
      <p>Alle Menschen sind frei und gleich an Würde und Rechten</p>
      <Button onClick={() => navigate(Page.Book)}>START</Button>
    </div>
  );
};

export default Landing;
