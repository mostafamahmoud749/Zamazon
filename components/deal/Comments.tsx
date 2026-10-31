import Stars from '@/components/deal/Stars';

export default function Comments() {
  return (
    <div className="mx-2 my-8 rounded-xl border bg-white border-gray-300  p-4 sm:p-6 md:mx-auto md:w-5/6 md:max-w-7xl">
      <h2 className="text-dark border-b border-gray-300 pb-5 text-xl font-semibold">
        Customer comments
      </h2>

      <div className="mt-6 grid gap-8 lg:grid-cols-3">
        <div className="divide-y divide-gray-300 lg:col-span-2">
          <div className="pb-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-dark font-semibold">Ahmed Hassan</h3>
              <p className="text-xs text-gray-500">October 26, 2026</p>
            </div>
            <div className="mt-2">
              <Stars value={5} />
            </div>
            <p className="mt-3 text-sm leading-6 text-gray-700">
              The product arrived on time and matched the description. I have been using it every
              day and I am happy with it.
            </p>
          </div>

          <div className="pt-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-dark font-semibold">Nour Ali</h3>
              <p className="text-xs text-gray-500">October 23, 2026</p>
            </div>
            <div className="mt-2">
              <Stars value={4} />
            </div>
            <p className="mt-3 text-sm leading-6 text-gray-700">
              Good quality for the price. The packaging could have been better, but everything
              arrived in good condition.
            </p>
          </div>
        </div>

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
              className="w-full rounded-md border border-gray-300 cursor-pointer px-3 py-2 text-sm focus:border-sky-700 focus:ring-1 focus:ring-sky-700 focus:outline-none"
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
      </div>
    </div>
  );
}
