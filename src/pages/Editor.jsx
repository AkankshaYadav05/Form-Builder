import { useParams } from 'react-router-dom';
import FormBuilder from './FormBuilder';

export default function Editor() {
  const { formId } = useParams();

  return (
    <div className="p-6">
      <FormBuilder formId={formId} />
    </div>
  );
}
