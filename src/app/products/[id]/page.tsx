import { auth } from "@/auth";
import { SubmitButton } from "@/components/client/button";
import ProductDetailsPage from "@/components/product/product-details";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  createProductReview,
  deleteProductReview,
  getProductById,
  getProductReviews,
} from "@/lib/actions/product";
import { LucideDelete } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const App = ({ params }: { params: { id: string } }) => {
  return (
    <main className="space-y-6 flex flex-col items-stretch">
      <Suspense fallback={<ProductLoader />}>
        <ProductsWrapper id={params.id} />
      </Suspense>

      <Suspense fallback={<ReviewLoader />}>
        <ReviewsWrapper id={params.id} />
      </Suspense>
    </main>
  );
};

const ReviewLoader = () => (
  <Card className="w-full max-w-4xl mx-auto px-4 py-8 flex items-center gap-3 overflow-auto ">
    <ReviewCardSkeleton />
    <ReviewCardSkeleton />
  </Card>
);

const ReviewCardSkeleton = () => (
  <div className="h-full w-full space-y-4">
    <Skeleton className="w-96 h-6" />
    <Skeleton className="w-96 h-6" />
    <Skeleton className="w-96 h-6" />
    <div className="flex items-center space-x-4">
      <Skeleton className="w-12 h-12 bg-gray-200 rounded-full"></Skeleton>
      <div className="space-y-2">
        <Skeleton className="w-24 h-6"></Skeleton>
        <Skeleton className="w-56 h-6"></Skeleton>
      </div>
    </div>
  </div>
);

const ProductLoader = () => (
  <div className="container mx-auto ">
    <Card className="w-full max-w-4xl mx-auto px-4 py-8  space-y-3">
      <Skeleton className="w-96 h-6" />

      <div className="flex">
        <Skeleton className="w-96 h-96" />
        <div className="p-4 space-y-4">
          <Skeleton className="w-48 h-6" />
          <Skeleton className="w-56 h-6" />
          <Skeleton className="w-48 h-6" />
          <Skeleton className="w-40 h-12" />
        </div>
      </div>
    </Card>
  </div>
);

const ReviewsWrapper = async ({ id }: { id: string }) => {
  const session = await auth();
  const reviews = await getProductReviews(id);
  const myReviewExists = reviews.some(
    (review) => review.user.id === session?.user.id
  );

  return (
    <>
      {myReviewExists ? null : <NewReviewDialog productId={id} />}
      <ScrollArea>
        <div className="w-full max-w-4xl mx-auto px-4 py-8 flex items-center gap-3 overflow-auto ">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <Card key={review.id} className="p-4 space-y-4 w-96 relative">
                {session?.user.id === review.user.id ? (
                  <form action={deleteProductReview}>
                    <Input
                      name="id"
                      value={review.id}
                      className="hidden"
                      readOnly
                    />
                    <SubmitButton
                      variant={"ghost"}
                      size={"icon"}
                      className="absolute top-2 right-2"
                    >
                      <LucideDelete />
                    </SubmitButton>
                  </form>
                ) : null}
                <p>{review.comment}</p>
                <div className="flex items-center space-x-4">
                  <Image
                    width={48}
                    height={48}
                    src={review.user.image || ""}
                    alt={review.user.name || "Avatar"}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="p-4 space-y-4">
                    <div className="font-bold">
                      {Array.from({ length: review.rating }, (_, i) => (
                        <span key={i}>⭐</span>
                      ))}
                    </div>
                    <div>By {review.user.name}</div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <p className="text-center  w-full">No reviews yet</p>
          )}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </>
  );
};

const NewReviewDialog = ({ productId }: { productId: string }) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button className="self-center" variant="outline">
        New Review
      </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>New Review</DialogTitle>
        <DialogDescription>
          Share your thoughts about this product
        </DialogDescription>
      </DialogHeader>
      <form action={createProductReview}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              required
              name="productId"
              className="hidden"
              readOnly
              value={productId}
            />
            <Label htmlFor="rating" className="text-right">
              Rating
            </Label>
            <Select required name="rating">
              <SelectTrigger id="rating" className="col-span-3">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <SelectItem key={rating} value={rating.toString()}>
                    {rating}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="comment" className="text-right">
              Comment
            </Label>
            <Textarea
              required
              id="comment"
              name="comment"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <SubmitButton loaderClassName="bg-white dark:bg-black">
            Create Review
          </SubmitButton>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
);

const ProductsWrapper = async ({ id }: { id: string }) => {
  const product = await getProductById(id);

  if (!product) return redirect("/404");

  return <ProductDetailsPage product={product} />;
};

export default App;
