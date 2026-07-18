import { useParams } from 'react-router-dom';

function ExampleDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h2>تفاصيل المثال</h2>
      <p>المعرف: {id}</p>
    </div>
  );
}

export default ExampleDetailPage;
