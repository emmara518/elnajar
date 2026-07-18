import { useExample } from '../hooks';

function ExamplePage() {
  const { items, isLoading, error } = useExample();

  if (error !== null) {
    return <div>خطأ: {error}</div>;
  }

  if (isLoading) {
    return <div>جاري التحميل...</div>;
  }

  return (
    <div>
      <h2>قائمة الأمثلة</h2>
      {items.length === 0 && <p>لا توجد عناصر</p>}
      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default ExamplePage;
