import { EllipseMiniSolid } from "@medusajs/icons"
import { Label, RadioGroup, Text, clx } from "@medusajs/ui"

type FilterRadioGroupProps = {
  title: string
  items: {
    value: string
    label: string
  }[]
  value: any
  handleChange: (...args: any[]) => void
  "data-testid"?: string
}

const FilterRadioGroup = ({
  title,
  items,
  value,
  handleChange,
  "data-testid": dataTestId,
}: FilterRadioGroupProps) => {
  return (
    <div className="flex flex-col gap-y-6">
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-silver/40">
        {title}
      </span>
      <RadioGroup data-testid={dataTestId} onValueChange={handleChange} value={value}>
        <div className="flex flex-col gap-y-3">
          {items?.map((i) => (
            <div
              key={i.value}
              className="flex items-center gap-x-3 group cursor-pointer"
            >
              <RadioGroup.Item
                checked={i.value === value}
                id={i.value}
                value={i.value}
                className="w-4 h-4 rounded-full border border-white/10 flex items-center justify-center transition-all group-hover:border-white/30 data-[state=checked]:border-meximco-accent"
              >
                {i.value === value && (
                  <div className="w-1.5 h-1.5 rounded-full bg-meximco-accent" />
                )}
              </RadioGroup.Item>
              <Label
                htmlFor={i.value}
                className={clx(
                  "text-[11px] font-bold uppercase tracking-widest cursor-pointer transition-colors",
                  i.value === value ? "text-white" : "text-silver/60 group-hover:text-silver"
                )}
                data-testid="radio-label"
                data-active={i.value === value}
              >
                {i.label}
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  )
}

export default FilterRadioGroup
