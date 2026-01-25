import SignLink from "@/components/auth/SignLink";

export default function SeeSign() {
    return(
    <div className="py-4 my-4 bg-white">
                <div className="border-y-1 py-4  bg-white border-gray-300">
            <div className="mt-8 font-bold text-2xl text-center">See personalized recommendations</div>
            <SignLink />
        </div>
    </div>
    )
}