import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import Button from 'src/celestial-ui/component/Button';
import Form from 'src/celestial-ui/component/Form';
import FormInput from 'src/celestial-ui/component/FormInput';
import H2 from 'src/celestial-ui/component/typography/H2';
import H5 from 'src/celestial-ui/component/typography/H5';
import { Page } from 'src/constant/Page';
import useQuery from 'src/hook/useQuery';
import IcBook from 'src/image/ic-book.svg';
import { ShareForm } from 'src/model/Form';
import { init, setShareBook } from 'src/service/shareService';

const Share = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const query = useQuery();
  const [name, setName] = useState<string>();
  const methods = useForm<ShareForm>();

  useEffect(() => {
    if (id === undefined) return;
    init(id)
      .then((res) => {
        if (res === undefined) navigate(`${Page.Book}/${id}`, { replace: true });
        else {
          setName(res);
          methods.setValue('code', query.code);
          if (query.code) onSubmit({ code: query.code });
        }
      })
      .catch(() => navigate(Page.Book, { replace: true }));
  }, [id]);

  const onSubmit = (data: ShareForm) => {
    if (!id) return;
    setShareBook(id, data.code)
      .then(() => navigate(`${Page.Book}/${id}`, { replace: true }))
      .catch(() =>
        methods.setError('code', { message: t('share.wrongCode') }, { shouldFocus: true }),
      );
  };

  if (name === undefined) return <></>;

  return (
    <div className="max-w-[640px] mx-[15px] sm:mx-auto">
      <H2 className="mt-[60px] mb-5">{t('share.join')}</H2>
      <div className="flex gap-[10px] p-[10px] flex-wrap bg-beige-300 rounded-[15px] items-center">
        <div className="bg-white w-fit h-fit rounded-full">
          <img src={IcBook} />
        </div>
        <H5>{name}</H5>
      </div>
      <Form className="mt-5 flex gap-[10px]" methods={methods} onSubmit={onSubmit}>
        <div className="flex-1 pt-4">
          <FormInput name="code" placeholder={t('share.code')} required inputMode="numeric" />
        </div>
        <div className="pt-4">
          <Button type="submit" appearance="default">
            {t('act.submit')}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Share;
