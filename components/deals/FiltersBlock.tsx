import Filter from '@/components/deals/Filter';
type FiltersBlockProps = {
  filtersState: Record<string, boolean>;
  name: string;
  labels?: Record<string, string>;
  toggle: (name: string) => void;
};
export default function FiltersBlock({ filtersState, name, toggle, labels }: FiltersBlockProps) {
  const showFilters = Object.entries(filtersState ?? {}).map(([key, value]) => (
    <Filter key={key} name={labels?.[key] ?? key} value={value} toggle={() => toggle(key)} />
  ));
  return (
    <div className="p-2">
      <div className="my-2 font-bold">{name}</div>
      <div className="flex flex-wrap gap-2 md:block md:w-fit">{showFilters}</div>
    </div>
  );
}
