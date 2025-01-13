'use client';

export default function ErrorPage({
  message = 'Something went wrong, Failed to fetch data.',
  title = 'An Error Occured!'
}) {
  return (
    <article className="not-found">
      <h1>{title}</h1>
      <p>{message}</p>
    </article>
  );
}
