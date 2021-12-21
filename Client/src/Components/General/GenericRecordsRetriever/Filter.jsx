import React, { useContext } from 'react';
import { IoClose } from 'react-icons/io5';
import FilterImage from '../../../Assets/Images/General-Filter.png';
import '../../../Assets/StyleSheet/Modifier.css';
import { ExtractFieldIdentifier } from '../../../Utils/Shortcuts';
import {
    Button,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Checkbox,
    ListItemText,
    FormHelperText,
    OutlinedInput
} from '@mui/material';
import { LanguageContext } from '../../../Services/Language/Context';

const Filter = ({
    SortFields,
    FilterFields,
    HandleApplyFilter,
    SetIsDisplayFilter,
    GetFields,
    GetSort,
    SetFields,
    SetSort
}) => {
    const { GetLanguages } = useContext(LanguageContext);

    const HandleOnChange = (Event, IsFieldFilter = undefined) => {
        const Setter = IsFieldFilter ? SetFields : SetSort;
        Setter(
            typeof Event.target.value === 'string'
                ? Event.target.value.split(',')
                : Event.target.value
        );
    };

    return (
        <aside className="Modifier-Aside">
            <section>
                <article className="Modifier-Aside-Information">
                    <div>
                        <h1>{GetLanguages.FILTER_INFORMATION_TITLE}</h1>
                        <p>{GetLanguages.FILTER_INFORMATION_SUBTITLE}</p>
                    </div>

                    <figure>
                        <img src={FilterImage} alt="Filter Information Img" />
                    </figure>
                </article>

                <article className="Modifier-Aside-Form">
                    <div>
                        <div>
                            <h3>{GetLanguages.FILTER_FORM_TITLE}</h3>
                            <i onClick={() => SetIsDisplayFilter(false)} className="Link Big">
                                <IoClose />
                            </i>
                        </div>
                        <div className="Form-Help-Text">
                            <p>{GetLanguages.FILTER_FORM_SUBTITLE}</p>
                        </div>
                    </div>

                    <form method="POST" onSubmit={HandleApplyFilter}>
                        <label className="Form-Item">
                            <FormControl size="small" fullWidth={true}>
                                <InputLabel>{GetLanguages.FILTER_FORM_FIELDS_LABEL}</InputLabel>
                                <Select
                                    multiple
                                    value={GetFields}
                                    onChange={(Event) => HandleOnChange(Event, true)}
                                    input={<OutlinedInput label="Fields" />}
                                    renderValue={(Selected) => Selected.join(', ')}
                                >
                                    {ExtractFieldIdentifier(FilterFields).map((Field, Index) => (
                                        <MenuItem key={Index} value={Field}>
                                            <Checkbox checked={GetFields.includes(Field)} />
                                            <ListItemText primary={Field} />
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>
                                    {GetLanguages.FILTER_FORM_FIELDS_HELP_TEXT}
                                </FormHelperText>
                            </FormControl>
                        </label>

                        <label className="Form-Item">
                            <FormControl helperText="x" size="small" fullWidth={true}>
                                <InputLabel>{GetLanguages.FILTER_FORM_SORT_LABEL}</InputLabel>
                                <Select
                                    multiple
                                    value={GetSort}
                                    onChange={(Event) => HandleOnChange(Event, false)}
                                    input={<OutlinedInput label="Sort" />}
                                    renderValue={(Selected) => Selected.join(', ')}
                                >
                                    {ExtractFieldIdentifier(SortFields).map((Field, Index) => (
                                        <MenuItem key={Index} value={Field}>
                                            <Checkbox checked={GetSort.includes(Field)} />
                                            <ListItemText primary={Field} />
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>
                                    {GetLanguages.FILTER_FORM_SORT_HELP_TEXT}
                                </FormHelperText>
                            </FormControl>
                        </label>

                        <div className="Form-Submit">
                            <Button variant="outlined" type="submit" className="Link Button">
                                {GetLanguages.FILTER_FORM_SUBMIT_BUTTON_TEXT}
                            </Button>
                        </div>
                    </form>
                </article>
            </section>
        </aside>
    );
};

export default Filter;
