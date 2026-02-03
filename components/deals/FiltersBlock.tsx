import Filter from '@/components/deals/Filter';
type FiltersBlockProps = {
  filtersState: Record<string, boolean>;
  name: string;
  toggle: (name: string) => void;
};
export default function FiltersBlock({
  filtersState,
  name,
  toggle,
}: FiltersBlockProps){
  const showFilters = Object.entries(filtersState ?? {}).map(([key, value]) => (
    <Filter key={key} name={key} value={value} toggle={toggle} />
  ));
  return (
    <div className="p-2">
      <div className="my-2 font-bold">{name}</div>
      <div className="flex flex-wrap gap-2 md:block md:w-fit">{showFilters}</div>
    </div>
  );
}
