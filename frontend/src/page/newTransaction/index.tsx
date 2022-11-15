import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Button from 'src/component/celestial-ui/Button';
import Divider from 'src/component/celestial-ui/Divider';
import Form from 'src/component/celestial-ui/Form';
import FormInput from 'src/component/celestial-ui/FormInput';
import FormNumberInput from 'src/component/celestial-ui/FormNumberInput';
import FormTextarea from 'src/component/celestial-ui/FormTextarea';
import Body from 'src/component/celestial-ui/typography/Body';
import { BillForm } from 'src/model/Form';
import Navbar from './Navbar';

const NewTransaction = () => {
  const { t } = useTranslation();
  const methods = useForm<BillForm>();

  const onSubmit = (data: BillForm) => {
    console.log(data);
  };

  return (
    <>
      <div className="fixed top-0 h-[calc(100%-104px)] w-full overflow-y-auto">
        <div className="max-w-[640px] mx-[15px] sm:mx-auto">
          <Navbar />
          <Form onSubmit={onSubmit} methods={methods}>
            <div className="flex gap-4 pb-4">
              <FormInput name="type" label="類別" />
              <FormInput name="date" label="時間" />
            </div>
            <div className="pb-4">
              <FormInput name="descr" label="項目" required />
            </div>
            <div className="pb-4">
              <FormNumberInput decimal={2} name="amount" label="金額" />
            </div>
            <Body>付款者</Body>
            <Divider />
            <Body>分攤者</Body>
            <Divider />
            <FormTextarea name="memo" label="備註" />
            <button className="hidden" />
          </Form>
        </div>
      </div>
      <div className="fixed bottom-0 h-[104px] w-full">
        <div className="mx-auto w-fit">
          <Button className="mt-5 w-64 h-12">
            <div className="flex justify-center">
              <Body size="l" bold className="text-white">
                {t('act.submit')}
              </Body>
            </div>
          </Button>
        </div>
      </div>
    </>
  );
};

export default NewTransaction;
