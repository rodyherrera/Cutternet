/***
 * Copyright (C) Rodolfo Herrera Hernandez. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project root
 * for full license information.
 *
 * =+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
 *
 * For related information - https://github.com/CodeWithRodi/Cutternet/
 *
 * Cutternet Client Source Code
 *
 * =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
 ****/
import axios from 'axios';
import { GetCurrentUserToken } from '../Services/Auth/Service';
import {
    DataValidation,
    FormattedRouteAPI,
    Routes,
    Server,
    AnalyticForEmbedded,
    LinkRoutesAPI
} from '../Infrastructure';

export const DoServerRequest = async ({
    OnFinish = undefined,
    OnStart = undefined,
    InPromise = {
        OnResolve: undefined,
        OnRejection: undefined
    },
    Axios = {
        Callback: undefined,
        Arguments: undefined
    },
    Setters = {
        OnErrorSetter: undefined
    },
    UpdateState = {
        Setter: undefined,
        Callback: undefined
    },
    Callbacks = {
        Success: {
            Callback: undefined,
            Arguments: undefined
        },
        Error: {
            Callback: undefined,
            Arguments: undefined
        }
    }
}) => {
    const HandlePromiseRejection = (Rejection) => {
        // ! In <Rejection> has .response object is an axios
        // ! rejection, server | request error
        if (Rejection.response)
            // ! In backend we MUST return an message with the error
            // ! if for some fucking reason the message does not exists
            // ! in the fucking response we send 'Server Error'
            Setters.OnErrorSetter(Rejection.response.data.Message || 'Server Error');
        // ! If .response does not exists, it is a JavaScript runtime error
        else Setters.OnErrorSetter(Rejection.message);
        // ! If the developer send some fucking callback for handle the fucking
        // ! rejection we call it
        if (InPromise.OnRejection !== undefined) InPromise.OnRejection(Rejection);
        if (OnFinish !== undefined) OnFinish(Rejection);
    };

    const HandleUpdateState = (Response) => {
        // ! ResponseMessage => 'Hello world'
        // ! { UpdateState: { Callback: (Response) => Response.Message.split(' '), Setter: Data } }
        // ! Data => ['Hello', 'World']
        if (UpdateState.Callback !== undefined)
            // ! MUST BE HAVE A FUCKING SETTER >:V
            UpdateState.Setter(UpdateState.Callback(Response));
    };

    const HandleResponse = async (Response) => {
        Setters.OnErrorSetter(Response.Message || '');
        // ! In the backend we MUST send the fucking status or
        // ! our fucking client application send errors and errors
        // ! and  much fucking errors
        if (Response.Status !== 'Success')
            // ! Generate integraded JavaScript runtime error
            // ! and send as message the server Message error
            throw new Error(Response.Message);
        HandleUpdateState(Response);
        HandlePromiseStatusCallback(Response, 'Success');
        if (InPromise.OnResolve !== undefined) await InPromise.OnResolve(Response);
        if (OnFinish !== undefined) OnFinish(Response);
    };

    const GetResponse = async (ReturnPromise = false) => {
        Setters.OnErrorSetter(null);
        if (OnStart !== undefined) OnStart();
        if (ReturnPromise) return await Axios.Callback(...(Axios.Arguments || []));
        const Request = await Axios.Callback(...(Axios.Arguments || []));
        const Response = Request.data;
        return Response;
    };

    const HandlePromiseStatusCallback = (Response, Status) => {
        const { Callback, Arguments } = Callbacks[Status] || [undefined, undefined];
        if (Callback !== undefined) Callback(Response, ...(Arguments || []));
    };

    if (InPromise.OnResolve !== undefined) {
        GetResponse(true)
            .then((Response) => HandleResponse(Response.data))
            .catch(HandlePromiseRejection);
        return;
    }

    try {
        const Response = await GetResponse();
        await HandleResponse(Response);
    } catch (MaybeServerRequestError) {
        HandlePromiseRejection(MaybeServerRequestError);
    }
};

export const MakeAuthorizationBearer = (Token) => ({
    Authorization: `Bearer ${Token}`
});

export const GenericRequestToBackend = ({
    Path,
    Method = 'GET',
    Body = {},
    Config = {},
    ParseBodyCallback = (Body) => Body,
    SendToken = false,
    Filter = {
        Sort: undefined,
        Fields: undefined,
        Paginate: {
            Page: undefined,
            Limit: undefined,
            Search: undefined
        }
    }
}) => {
    if (SendToken)
        Config.headers = {
            ...Config.headers,
            Authorization: `Bearer ${GetCurrentUserToken()}`
        };
    let FilterBuffer = '?';
    const AppendParameter = (Parameter) =>
        (FilterBuffer += FilterBuffer === '?' ? Parameter : '&' + Parameter);
    // ! Sort = ['Price', 'Category']
    // ! FilterBuffer = '?Sort=Price,Category
    if (Filter.Sort !== undefined) FilterBuffer += 'Sort=' + Filter.Sort.join(',');
    // ! ReturnData => ['Category', 'Price', 'Name', 'Description', 'Author']
    // ! Fields => ['Name', 'Price', 'Author']
    // ! ReturnData => ['Name', 'Price', 'Author']
    if (Filter.Fields !== undefined) AppendParameter('Fields=' + Filter.Fields.join(','));
    // ! Pagination
    AppendParameter('Page=' + (Filter.Paginate.Page || 1) + '&Limit=' + Filter.Paginate.Limit);
    // ! Search Text
    if (Filter.Search !== undefined) AppendParameter('Search=' + Filter.Search);
    let Arguments = [FormattedRouteAPI(Path + FilterBuffer)];
    Method = Method.toLowerCase();
    if (['post', 'put', 'patch'].includes(Method)) Arguments.push(ParseBodyCallback(Body));
    Arguments.push(Config);
    return axios[Method](...Arguments);
};

export const ParseToURLParameters = (Subject, AsArray = undefined) => {
    // ! If subject is object
    // ! ?Name=Rodolfo&Age=16 => { Name: 'Rodolfo', Age: 16 }
    // ! If subject is array
    // ! /Hello/World/ => ['Hello', 'World']
    if (typeof Subject !== 'object')
        // ! Array === Object wtf this is JavaScript!
        return;
    let URL = '';
    if (AsArray instanceof Array)
        Object.keys(Subject).forEach((Element) =>
            AsArray.includes(Element) ? (URL += Subject[Element] + '/') : null
        );
    else if (Subject instanceof Array) Subject.forEach((Element) => (URL += Element + '/'));
    else Object.keys(Subject).forEach((Key) => (URL += Subject[Key] + '/'));
    return URL;
};

// ! What is that fucking shit?
// ! LocationPath => Browser path
// ! NonFormattedRoutePath => App Source Code(src/Settings/ClientRoutes.json)
// ! Example:
// ! LocationPath => /Links/CodeWithRodi/Website/
// ! NonFormattedRoutePath => /Links/:Username/:LinkName/
// ! IsEqualLocationPathWithNonFormattedRoutePath => True
// ! ||
// ! LocationPath => /CodeWithRodi/Videos/
// ! NonFormattedRoutePath => /:Username/Videos/Comments/
// ! IsEqualLocationPathWithNonFormattedRoutePath => False
export const IsEqualLocationPathWithNonFormattedRoutePath = ({
    LocationPath,
    NonFormattedRoutePath,
    ReturnBuffer = false,
    IsEqualCallback = undefined
}) => {
    // ! Next, it will be verified if the value of the <LocationPath> and
    // ! <NonFormattedRoutePath> variables has '/' as the first character, if
    // ! this is affirmative, the value will be reassigned to the next character.
    if (LocationPath.startsWith('/')) LocationPath = LocationPath.slice(1);
    if (NonFormattedRoutePath.startsWith('/'))
        NonFormattedRoutePath = NonFormattedRoutePath.slice(1);
    // ! As in the previous instructions, we will do something similar, it will be
    // ! verified if the <LocationPath> and <NonFormattedRoutePath> variables end
    // ! with a '/' character, if this is affirmative, the value will be reassigned
    // ! to the previous character from the last index of the strings.
    if (LocationPath.endsWith('/')) LocationPath = LocationPath.slice(0, LocationPath.length - 1);
    if (NonFormattedRoutePath.endsWith('/'))
        NonFormattedRoutePath = NonFormattedRoutePath.slice(0, NonFormattedRoutePath.length - 1);
    // ! We check if the strings still have the characters '/', if this is affirmative
    // ! it means that the strings contain parameters and / or information inside to
    // ! be able to make a match and verify if they are the same, if this is negative
    // ! there is nothing to do, they simply cannot be equal.
    if (!LocationPath.includes('/') && !NonFormattedRoutePath.includes('/')) return false;
    // ! Creating an object that will act as a buffer to store
    // ! the data of the parsed and non-parsed paths.
    const Buffer = {
        NotParsed: {
            // ! Doing a split to both paths sent as parameters, where each
            // ! value of the array that will be formed will represent a
            // ! value, part and / or information of the path.
            LocationPath: LocationPath.split('/'),
            NonFormattedRoutePath: NonFormattedRoutePath.split('/')
        },
        Parsed: {
            // ! Creating two empty arrays, which contain within the parsed data of the paths.
            LocationPath: [],
            NonFormattedRoutePath: []
        }
    };
    // ! Checking the length of both arrays, if they are of different
    // ! lengths they CANNOT be the same, they are different :v.
    if (Buffer.NotParsed.LocationPath.length !== Buffer.NotParsed.NonFormattedRoutePath.length)
        return false;
    // ! Hey rodi why the hell do you use a for loop and not a forEach, map, or any
    // ! other rubbish, well gentleman because we need help from an iterator, this way we can
    // ! access a specific index of the arrays that we have previously formed with the help
    // ! of a split using the '/' character.
    for (
        let PathIterator = 0;
        PathIterator < Buffer.NotParsed.NonFormattedRoutePath.length;
        PathIterator++
    )
        // ! We verify according to the value of the loop iteration
        // ! for the element of the array that contains the parts of the unformatted
        // ! url, if the value begins with a ':' it means that it is a variable, therefore
        // ! we will not save them in the arrays that will contain the parsed data, we won't
        // ! do anything with this shit.
        if (!Buffer.NotParsed.NonFormattedRoutePath[PathIterator].startsWith(':')) {
            // ! In case it is not a variable, we will save the non-formatted path that
            // ! was evaluated in the corresponding arrays for both the non-formatted
            // ! path and the part of the location path.
            Buffer.Parsed.LocationPath.push(Buffer.NotParsed.LocationPath[PathIterator]);
            Buffer.Parsed.NonFormattedRoutePath.push(
                Buffer.NotParsed.NonFormattedRoutePath[PathIterator]
            );
        }
    // ! Deleting the data not parsed, we will not use them anymore, they
    // ! go to the same shit, the ram does not want them D:
    if (!ReturnBuffer) delete Buffer.NotParsed;
    // ! Again using a for loop to obtain an iterator we will verify
    // ! according to the value of the iterator if the indices of the arrays
    // ! are NOT equal, in case they are NOT equal it means that the paths sent
    // ! are not equal, if at least one is detected it will automatically return false .
    for (let PathIterator = 0; PathIterator < Buffer.Parsed.LocationPath.length; PathIterator++)
        if (
            Buffer.Parsed.LocationPath[PathIterator] !==
            Buffer.Parsed.NonFormattedRoutePath[PathIterator]
        )
            return false;
    // ! The following verification will verify that the current LocationPath of
    // ! the browser is NOT equal to an existing one in the routes that the application
    // ! contains, this to avoid future errors, because if there is a route whose is
    // ! '/: Username /: LinkName' and the Browser path is '/ auth / signin /' will match
    // ! it, to avoid this we will do this check.
    let IsOriginalRoute = true;
    Object.values(Routes).forEach((RoutesContainer) => {
        Object.values(RoutesContainer).forEach((Route) => {
            if (Route.endsWith('/') && !LocationPath.endsWith('/')) LocationPath += '/';
            if (!Route.endsWith('/') && LocationPath.endsWith('/')) Route += '/';
            if (Route.startsWith('/') && !LocationPath.startsWith('/'))
                LocationPath = '/' + LocationPath;
            if (Route === LocationPath) IsOriginalRoute = false;
        });
    });
    if (!IsOriginalRoute) return false;
    // ! If all the checks are passed successfully, we will return
    // ! true referring to the fact that both paths are the same.
    if (IsEqualCallback !== undefined) IsEqualCallback();
    if (ReturnBuffer) return Buffer;
    return true;
};

// ! Examples of usage
// ! FormatRoutePathWithContext('/Posts/:Username/:BlogSlug/', ['CodeWithRodi', 'Some-Shit', true])
// ! Output => [http(s)]//[hostname]/Posts/CodeWithRodi/Some-Shit/
// ! FormatRoutePathWithContext('/Posts/:Username/:BlogSlug/', ['CodeWithRodi', 'Some-Shit'])
// ! Output => /Posts/CodeWithRodi/Some-Shit/
// ! FormatRoutePathWithContext({
// !    RoutePath: '/Videos/:Username/:VideoSlug/',
// !    Context: {
// !        Username: 'CodeWithRodi',
// !        VideoSlug: 'Ugly-Video'
// !    },
// !    WithLocalSchema: true
// ! })
// ! Output => [http(s)]//[hostname]/Videos/CodeWithRodi/Ugly-Video/
export const FormatRoutePathWithContext = ({ RoutePath, Context, WithLocalSchema = false }) => {
    if (RoutePath.startsWith('/')) RoutePath.slice(1);
    if (RoutePath.endsWith('/')) RoutePath.slice(0, RoutePath.length - 1);
    RoutePath = RoutePath.split('/');
    let Buffer = [];
    for (let PathIterator = 0; PathIterator < RoutePath.length; PathIterator++)
        if (RoutePath[PathIterator].startsWith(':')) {
            if (Context instanceof Array) Buffer.push(Context.shift());
            else {
                const VariableName = RoutePath[PathIterator].slice(1);
                Buffer.push(Context[VariableName]);
            }
        } else Buffer.push(RoutePath[PathIterator]);
    Buffer = Buffer.join('/');
    if (WithLocalSchema) {
        let { protocol, hostname, port } = window.location;
        if (port !== '') port = ':' + port;
        Buffer = protocol + '//' + hostname + port + Buffer;
    }
    return Buffer;
};

export const GenericFormattedDate = (DateToFormat) => {
    const UserLanguage = GetClientLanguage();
    const Config = { year: 'numeric', month: 'long', day: '2-digit' };
    return new Date(DateToFormat).toLocaleString(UserLanguage, Config);
};

export const ExtractMonthFromDate = (DateToFormat) => {
    const UserLanguage = GetClientLanguage();
    return new Date(DateToFormat).toLocaleDateString(UserLanguage, {
        month: 'long'
    });
};

export const SetPageAccordToRecords = (RecordsLength, SetPage, GetPage) =>
    RecordsLength === 1
        ? GetPage - 1 !== 1
            ? SetPage(GetPage - 1)
            : SetPage(1)
        : SetPage(GetPage);

export const HandleLinkStatisticsDistribution = (Statistics) =>
    new Promise((Resolve, Reject) => {
        Statistics = Object.values(Statistics);
        // ! Schema
        const DistributedStatistics = {
            OperatingSystems: {},
            BrowserLanguages: {},
            Browsers: {},
            Countries: {},
            MonthVisits: {
                January: 0,
                February: 0,
                March: 0,
                April: 0,
                May: 0,
                June: 0,
                July: 0,
                August: 0,
                September: 0,
                October: 0,
                November: 0,
                December: 0
            }
        };
        const RegisterStatistic = ({ Destinity, ExtractFrom }) => {
            const Statistic = DistributedStatistics[Destinity];
            Statistics.forEach((ObjectWithData) =>
                Statistic[ObjectWithData[ExtractFrom]] === undefined
                    ? (Statistic[ObjectWithData[ExtractFrom]] = 1)
                    : (Statistic[ObjectWithData[ExtractFrom]] += 1)
            );
        };
        const GetMonth = (StatisticData) => {
            const RegisteredAt = new Date(StatisticData.RegisteredAt);
            const CurrentDate = new Date(new Date());
            return CurrentDate.getFullYear() === RegisteredAt.getFullYear()
                ? RegisteredAt.getMonth()
                : null;
        };
        // ! Statistics for Operating Systems
        RegisterStatistic({
            Destinity: 'OperatingSystems',
            ExtractFrom: 'OperatingSystem'
        });
        // ! Statistics for Browser Languages
        RegisterStatistic({
            Destinity: 'BrowserLanguages',
            ExtractFrom: 'BrowserLanguage'
        });
        // ! Statistics for Browsers
        RegisterStatistic({ Destinity: 'Browsers', ExtractFrom: 'Browser' });
        // ! Statistics for Countries
        RegisterStatistic({ Destinity: 'Countries', ExtractFrom: 'Country' });
        // ! Statistics for visits in the months
        const Months = Object.keys(DistributedStatistics.MonthVisits);
        Statistics.forEach((ObjectWithData) => {
            const Month = GetMonth(ObjectWithData);
            if (Month === null) return;
            DistributedStatistics.MonthVisits[Months[Month]] += 1;
        });
        // ! Eliminate all the statistics of the months where the number of
        // ! visits is equal to 0, we do not want to show garbage.
        // ! Return Distributed Data
        return Resolve(DistributedStatistics);
    });

export const RedirectUser = (URL) => {
    if (!URL.startsWith('http://') && !URL.startsWith('https://')) URL = 'http://' + URL;
    window.location.href = URL;
};

export const ExtractError = (ErrorMessage) => {
    const Errors = [];
    ErrorMessage.replaceAll('Network Error', 'SERVER_DOWN')
        .replaceAll('(E)', '')
        .replaceAll(',', '')
        .split(' ')
        .forEach(
            (ClientError) => ClientError === ClientError.toUpperCase() && Errors.push(ClientError)
        );
    return Errors.length >= 2 ? Errors : Errors.join('');
};

export const GetClientLanguage = () => {
    let Locale = navigator.language || navigator.userLanguage;
    if (Locale.includes('-')) Locale = Locale.split('-')[0];
    return Locale.toLowerCase();
};

// ! String => {{User}}, welcome!
// ! Values => { User: 'Rodolfo Herrera Hernandez' }
// ! ForamtString(String, Values)
// ! Output => Rodolfo Herrera Hernandez, welcome!
export const FormatString = ({
    UnformattedString,
    Values,
    SafeLength = false,
    SafeLengthMax = 16
}) => {
    Object.keys(Values).forEach((Key) => {
        let Replacement = Values[Key];
        if (SafeLength && Replacement.length > SafeLengthMax)
            Replacement = Replacement.slice(0, SafeLengthMax) + '...';
        UnformattedString = UnformattedString.replaceAll(`{{${Key}}}`, Replacement);
    });
    return UnformattedString;
};

export const SetFormattedTitle = (Title, GetLanguages = undefined) =>
    (document.title = GetLanguages
        ? FormatString({
              UnformattedString: '{{Title}} - {{Auxiliar}}',
              Values: { Title, Auxiliar: GetLanguages.TITLE_AUXILIAR }
          })
        : Title);

export const CheckErrors = ({ Validator, States }) => {
    const Validation = DataValidation[Validator];
    if (!Validation) return;
    const Buffer = Object.fromEntries(States.map((State) => [State.Identifier, undefined]));
    States.forEach((State) => {
        if (!State.Getter) return;
        const StateValidation = Validation[State.Identifier] || {};
        const StateLength = (
            State.LengthWithoutWhitespaces ? State.Getter.replaceAll(' ', '') : State.Getter
        ).length;
        if (State.Validator && !State.Validator[0]()) Buffer[State.Identifier] = State.Validator[1];
        else if (
            (StateLength < StateValidation.MinLength || StateLength > StateValidation.MaxLength) &&
            State.Getter !== ''
        )
            Buffer[State.Identifier] = FormatString({
                UnformattedString: State.OnLengthError,
                Values: {
                    MaxLength: StateValidation.MaxLength,
                    MinLength: StateValidation.MinLength
                }
            });
        else if (StateValidation.Enum && !StateValidation.Enum.includes(State.Getter.toLowerCase()))
            Buffer[State.Identifier] = FormatString({
                UnformattedString: State.OnEnumError,
                Values: { Enums: StateValidation.Enum.join(' ') }
            });
        else if (State.CompareWith !== State.Getter)
            Buffer[State.Identifier] = State.OnCompareError;
        else Buffer[State.Identifier] = undefined;
    });
    return Buffer;
};

export const SlugToTitle = (Slug, WithWhitespace = false) => {
    let Words = Slug.split('-');
    for (let CharacterIterator = 0; CharacterIterator < Words.length; CharacterIterator++) {
        const Word = Words[CharacterIterator];
        Words[CharacterIterator] = Word.charAt(0).toUpperCase() + Word.slice(1);
    }
    return Words.join(WithWhitespace ? ' ' : '');
};

export const SafeLength = (Text, Length = 26) =>
    Text.length > Length ? Text.slice(0, Length) + '...' : Text;

export const CopyToClipboard = (Content) => {
    const TextArea = document.createElement('textarea');
    const IsiOS = navigator.userAgent.match(/ipad|iphone/i);

    TextArea.value = Content;
    TextArea.style.position = 'absolute';
    TextArea.style.left = '-9999px';
    TextArea.setAttribute('readonly', '');

    document.body.appendChild(TextArea);

    if (IsiOS) {
        const Range = document.createRange();
        Range.selectNodeContents(TextArea);
        const Selection = window.getSelection();
        Selection.removeAllRanges();
        Selection.addRange(Range);
        TextArea.setSelectionRange(0, Content.length);
    } else {
        TextArea.select();
    }

    try {
        return document.execCommand('copy');
    } catch (CopyError) {
        return false;
    } finally {
        document.body.removeChild(TextArea);
    }
};

export const ExtractFieldIdentifier = (FieldList) => FieldList.map((Field) => Field[0]);

export const GetEmbeddedCode = (Username, LinkName) =>
    FormatString({
        UnformattedString: `
<script type='application/javascript' src='{{Server}}{{AnalyticForEmbedded}}'></script>
<script type='application/javascript'>RegisterCutternetAnalytic('{{Server}}{{GetLinkRoute}}{{Username}}/{{LinkName}}')</script>
`,
        Values: {
            Server,
            AnalyticForEmbedded,
            Username,
            LinkName,
            GetLinkRoute: LinkRoutesAPI.CRUD
        }
    });

export const GetIPAddress = async () => await (await fetch('https://api.ipify.org')).text();

export const ExtractUserData = () => {
    const Lists = {
        OperatingSystems: [
            'iOS',
            'Android OS',
            'BlackBerry OS',
            'Windows Mobile',
            'Amazon OS',
            'Windows 3.11',
            'Windows 95',
            'Windows 98',
            'Windows 2000',
            'Windows XP',
            'Windows Server 2003',
            'Windows Vista',
            'Windows 7',
            'Windows 8',
            'Windows 8.1',
            'Windows 10',
            'Windows ME',
            'Windows CE',
            'Open BSD',
            'Sun OS',
            'Linux',
            'Mac OS',
            'QNX',
            'BeOS',
            'OS/2',
            'Chrome OS'
        ],
        Browsers: [
            'aol',
            'edge',
            'edge-ios',
            'yandexbrowser',
            'kakaotalk',
            'samsung',
            'silk',
            'miui',
            'beaker',
            'edge-chromium',
            'chrome',
            'chromium-webview',
            'phantomjs',
            'crios',
            'firefox',
            'fxios',
            'opera-mini',
            'opera',
            'pie',
            'netfront',
            'ie',
            'bb10',
            'android',
            'ios',
            'safari',
            'facebook',
            'instagram',
            'ios-webview',
            'curl',
            'searchbot'
        ]
    };
    let Data = {
        Browser: undefined,
        OperatingSystem: undefined,
        BrowserLanguage: undefined
    };
    const LowerCaseUserAgent = navigator.userAgent.toLowerCase();
    for (let Iterator = 0; Iterator < Lists.Browsers.length; Iterator++)
        if (LowerCaseUserAgent.indexOf(Lists.Browsers[Iterator]) !== -1) {
            Data.Browser = Lists.Browsers[Iterator];
            break;
        }
    for (let Iterator = 0; Iterator < Lists.OperatingSystems.length; Iterator++)
        if (navigator.userAgent.indexOf(Lists.OperatingSystems[Iterator]) !== -1) {
            Data.OperatingSystem = Lists.OperatingSystems[Iterator];
        }
    Data.BrowserLanguage = GetClientLanguage();
    return Data;
};
