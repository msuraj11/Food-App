'use client';

export default function ErrorPage({
  message = 'An Error Occured!',
  title = 'Something went wrong, Failed to fetch data.'
}) {
  return (
    <article className="not-found">
      <h1>{title}</h1>
      <p>{message}</p>
    </article>
  );
}
