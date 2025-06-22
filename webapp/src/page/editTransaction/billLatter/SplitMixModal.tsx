import classNames from 'classnames';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import FormNumberInput from 'src/component/FormNumberInput';
import ModalForm from 'src/component/ModalForm';
import Body from 'src/component/typography/Body';
import { ShareMethod } from 'src/constant/backend/Book';
import IcPctInactive from 'src/image/ic-method-pct-inactive.svg';
import IcPct from 'src/image/ic-method-pct.svg';
import IcWeightInactive from 'src/image/ic-method-weight-inactive.svg';
import IcWeight from 'src/image/ic-method-weight.svg';
import { Member } from 'src/model/backend/entity/Member';
import { SplitForm } from 'src/model/Form';
import { addMemberToBillLatter } from 'src/service/transactionService';

type Props = {
  open: boolean;
  onClose: () => void;
  member?: Member;
  mode: 'weight' | 'pct';
};

const SplitMixModal = ({ open, onClose, member, mode }: Props) => {
  const { t } = useTranslation();
  const methods = useForm<SplitForm>();
  const [tab, setTab] = useState<'weight' | 'pct'>(mode);

  const handleClose = () => {
    methods.reset();
    onClose();
  };

  const onSubmit = (data: SplitForm) => {
    if (!member) return;
    addMemberToBillLatter(member.id, mode, {
      id: member.id,
      method: tab === 'weight' ? ShareMethod.Weight : ShareMethod.Percentage,
      value: Number(data.value),
    });
    methods.reset();
    handleClose();
  };

  if (!member) return <></>;

  return (
    <ModalForm
      methods={methods}
      onSubmit={onSubmit}
      open={open}
      handleClose={handleClose}
      cancelBtn={t('act.cancel')}
      confirmBtn={t('act.submit')}
      title={t('editTx.modalTitle', { nickname: member.nickname })}
    >
      <>
        <div className="mb-[15px] flex gap-[10px]">
          <div
            className={classNames(
              'flex h-[30px] w-full cursor-pointer items-center justify-center rounded-[4px]',
              {
                'bg-tan-300': tab === 'weight',
                'bg-grey-200': tab !== 'weight',
              },
            )}
            onClick={() => setTab('weight')}
          >
            <img src={tab === 'weight' ? IcWeight : IcWeightInactive} />
          </div>
          <div
            className={classNames(
              'flex h-[30px] w-full cursor-pointer items-center justify-center rounded-[4px]',
              {
                'bg-tan-300': tab === 'pct',
                'bg-grey-200': tab !== 'pct',
              },
            )}
            onClick={() => setTab('pct')}
          >
            <img src={tab === 'pct' ? IcPct : IcPctInactive} />
          </div>
        </div>
        <div className="relative">
          <FormNumberInput
            decimal={2}
            name="value"
            autoFocus
            required
            label={tab === 'weight' ? t('editTx.weight') : t('editTx.pct')}
          />
          <Body size="l" className="absolute right-2 bottom-2 text-navy-500">
            {tab === 'weight' ? t('editTx.unitWeight') : t('editTx.unitPct')}
          </Body>
        </div>
      </>
    </ModalForm>
  );
};

export default SplitMixModal;
