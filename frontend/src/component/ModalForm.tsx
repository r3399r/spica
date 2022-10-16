import { ReactElement } from 'react';
import { FieldValues, SubmitHandler, UseFormReturn } from 'react-hook-form';
import Button from './Button';
import Form from './form/Form';
import Modal from './Modal';
import H2 from './typography/H2';

type Props<T extends FieldValues> = {
  methods: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
  open: boolean;
  handleClose: () => void;
  title?: string;
  children: ReactElement;
  cancelBtn?: string;
  confirmBtn?: string;
};

const ModalForm = <T extends FieldValues>({
  methods,
  onSubmit,
  title,
  children,
  cancelBtn,
  confirmBtn,
  handleClose,
  ...props
}: Props<T>) => (
  <Modal handleClose={handleClose} {...props}>
    <Form methods={methods} onSubmit={onSubmit}>
      {title && <H2 className="mb-[15px]">{title}</H2>}
      <div className="pb-[20px]">{children}</div>
      {(cancelBtn || confirmBtn) && (
        <div className="flex justify-end pt-[10px] gap-[15px] pb-[30px] flex-wrap">
          {cancelBtn && (
            <Button appearance="secondary" onClick={handleClose} type="button">
              {cancelBtn}
            </Button>
          )}
          {confirmBtn && (
            <Button appearance="default" type="submit">
              {confirmBtn}
            </Button>
          )}
        </div>
      )}
    </Form>
  </Modal>
);

export default ModalForm;
