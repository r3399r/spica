import BackButton from 'src/component/BackButton';

type Props = {
  text: string;
};

const NavbarVanilla = ({ text }: Props) => (
  <div className="mb-5 mt-[15px]">
    <BackButton text={text} />
  </div>
);

export default NavbarVanilla;
