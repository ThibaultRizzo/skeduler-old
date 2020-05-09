import React from 'react';
import { FieldArray, useField, useFormikContext } from 'formik';
import { Select, Input, Chip, MenuItem } from '@material-ui/core';

interface FormMultiSelect {
    name: string;
    options: any[];
    getKey: (key: any) => any;
    getValue: (value: any) => any;
}

export default ({ name, options, getKey, getValue }: FormMultiSelect) => {
    const [{ value }] = useField(name);
    const { setFieldValue } = useFormikContext();
    console.log({ options });
    return (
        <FieldArray
            name={name}
            render={() => (
                <Select
                    multiple
                    value={value || []}
                    onChange={e => setFieldValue(name, e.target.value)}
                    input={<Input id="select-multiple-chip" />}
                    renderValue={(selected: any) => (
                        <div>
                            {console.log({ selected })}
                            {selected &&
                                selected.length > 0 &&
                                selected
                                    .map((s: any) => options.find(o => getKey(o) === s))
                                    .map((p: any) => p && <Chip key={getKey(p)} label={getValue(p)} />)}
                        </div>
                    )}
                >
                    {options.map(p => (
                        <MenuItem key={getKey(p)} value={getKey(p)}>
                            {getValue(p)}
                        </MenuItem>
                    ))}
                </Select>
            )}
        />
    );
};
