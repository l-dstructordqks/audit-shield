import io
import pandas as pd

REQUIRED_COLUMNS = {'timestamp', 'src_ip', 'dst_ip', 'dst_port', 'protocol', 'bytes', 'latency_ms'}
# IPs/rangos de CDNs conocidas — endpoints fuera de estos se marcan como suspicious
KNOWN_CDN_PREFIXES = (
    "142.250.",   # Google
    "172.217.",   # Google
    "185.199.",   # GitHub CDN
    "151.101.",   # Fastly
    "104.16.",    # Cloudflare
    "104.17.",    # Cloudflare
    "13.",        # AWS CloudFront
    "52.",        # AWS
    "54.",        # AWS
)

def load_traffic_csv(content: str) ->  pd.DataFrame:

    # transfrom the content into a simulated real open file like ".txt" or ".csv"
    # then we read usin panda read_csv function
    df = pd.read_csv(io.StringIO(content))

    #comprobe if we ave all required columns
    missing = REQUIRED_COLUMNS - set(df.columns)
    if missing:
        raise ValueError(f"CSV missing required columns: {missing}")

    # Converts timestamp to datetime to eneable comparation by time
    df['timestamp'] = pd.to_datetime(df['timestamp'])

    return df


def calculate_baseline(df: pd.DataFrame) -> dict:
    #calculate staditic parameters of te traffic , reference values to detect anomalies and baseline to et_times_series

    # calculates te total time in minutes
    total_minutes = (
        (df['timestamp'].max() - df['timestamp'].min()).total_seconds() / 60
    )
    # count te rows per minutes
    events_per_min = len(df) / total_minutes if total_minutes > 0 else 0

    #return latency, bytes (mean and standar desviation) and events per minute
    # latency(conection lent): verifies te stability of te conexion
    # Latency is the mesure in ms about the time a packae takes to travel from te origin to te destiny
    # the Bytes mesures te quantity of information that is bein send or recive. "package weigth" "petition size" 
    return {
        'latency_mean': df['latency_ms'].mean(),
        'latency_std': df['latency_ms'].std(),
        'bytes_mean': df['bytes'].mean(),
        'bytes_std': df['bytes'].std(),
        'events_per_min': round(events_per_min, 2),
    }

def detect_anomalies(df: pd.DataFrame, baseline: dict) -> list[dict]:

    anomalies = []

    # latency_threshold outlier value, that mathces te 68-95-99.7, unusual events
    latency_threshold = baseline['latency_mean'] + 2 * baseline['latency_std']
    # bytes_threshold alerts about Exfiltración de datos, Streaming o Descargas, Ataque DDoS (saturación de red) Error de Aplicación (un bucle infinito)
    bytes_threshold   = baseline['bytes_mean'] * 10

    # iterrows(){allows analysis rows by rows te dataframe}
    # row stores all values of each row
    # iterrow returns a index and the row, with (_) store te index row and ignores
    for _, row in df.iterrows():
        # find what row as a latency value hihger than our latency threshold
        if row['latency_ms'] > latency_threshold:
            anomalies.append({
                'timestamp': str(row['timestamp']),
                'type': 'HIGH_LATENCY',
                'value': round(row['latency_ms'], 2),
                'threshold': round(latency_threshold, 2),
            })
        # find what row as a bytes value hihger than our bytes threshold
        if row['bytes'] > bytes_threshold:
            anomalies.append({
                'timestamp': str(row['timestamp']),
                'type': 'HIGH_BYTES',
                'value': int(row['bytes']),
                'threshold': round(bytes_threshold, 2),
            })

    return anomalies

def get_timeseries(df: pd.DataFrame, interval: str = '1min') -> list[dict]:
# orups te traffic in time interval, returns [{timestamp, avg_latency, total_bytes, baseline_latency}] to draw two curves of te diital twin

    # converts timestamp in te index colunm
    df = df.set_index('timestamp')
    # resample(interval){groups all data that occurs in 1minute}
    grouped = df.resample(interval).agg( # defines actions to take wit te rouped values
        
        avg_latency=('latency_ms', 'mean'), # takes all latencies occurs in a minute and calculates te latency mean
        total_bytes=('bytes', 'sum'), # Sums all bytes in te 1 minute interval
        event_count=('bytes', 'count'), # counts te events occurs in 1 minute
    ).dropna() # eliminates allrows witout data or wit Nan data

    # baseline_latency es la media global — la línea de referencia del gemelo digital
    baseline_latency = df['latency_ms'].mean()

    return [
        {
            'timestamp': str(ts),
            'avg_latency': round(row['avg_latency'], 2),
            'total_bytes': int(row['total_bytes']),
            'event_count': int(row['event_count']),
            'baseline_latency': round(baseline_latency, 2),
        }
        for ts, row in grouped.iterrows()
    ]

def analyze_endpoints(df: pd.DataFrame) -> list[dict]:
    #groups the traffic by destination IP and compares with the known CDN and returns [{ip, total_bytes, request_count, is_suspicious}]

    grouped = df.groupby('dst_ip').agg(
        total_bytes=('bytes', 'sum'),
        request_count=('bytes', 'count'),
    ).reset_index()

    result = []
    for _, row in grouped.iterrows():
        ip = row['dst_ip']
        # if te ip dont start in te prefix of KNOWN_CDN_PREFIXES is suspicious
        is_suspicious = not any(ip.startswith(prefix) for prefix in KNOWN_CDN_PREFIXES)

        result.append({
            'ip': ip,
            'total_bytes': int(row['total_bytes']),
            'request_count': int(row['request_count']),
            'is_suspicious': is_suspicious,
        })

    # Ordena por bytes descendente — los endpoints más activos primero
    return sorted(result, key=lambda x: x['total_bytes'], reverse=True)

def get_network_risk_score(anomalies: list[dict], total: int) -> float:

    if total == 0:
        return 0.0

    ratio = len(anomalies) / total
    return round(min(ratio * 100, 100), 2)