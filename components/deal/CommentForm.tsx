export default function CommentForm() {
  return (
    <div className="border-t border-gray-300 pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
      <h3 className="text-dark text-lg font-semibold">Write a comment</h3>

      <div className="mt-4">
        <label htmlFor="comment-rating" className="text-dark mb-2 block text-sm font-medium">
          Your rating
        </label>
        <select
          id="comment-rating"
          name="rating"
          defaultValue="5"
          className="w-full cursor-pointer rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-sky-700 focus:ring-1 focus:ring-sky-700 focus:outline-none"
        >
          <option value="5">5 stars</option>
          <option value="4">4 stars</option>
          <option value="3">3 stars</option>
          <option value="2">2 stars</option>
          <option value="1">1 star</option>
        </select>
      </div>

      <div className="mt-4">
        <label htmlFor="product-comment" className="text-dark mb-2 block text-sm font-medium">
          Your comment
        </label>
        <textarea
          id="product-comment"
          name="comment"
          rows={4}
          placeholder="What did you think of this product?"
          className="block w-full resize-y rounded-md border border-gray-300 px-3 py-2 text-sm leading-6 placeholder:text-gray-400 focus:border-sky-700 focus:ring-1 focus:ring-sky-700 focus:outline-none"
        />
      </div>

      <button
        type="button"
        className="bg-yellow text-dark focus-visible:outline-dark_blue mt-4 w-full cursor-pointer rounded-full px-5 py-2.5 text-sm font-medium transition-colors hover:bg-yellow-400 focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        Post comment
      </button>
    </div>
  );
}
