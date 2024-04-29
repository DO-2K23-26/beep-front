{{/* Generate basic labels */}}
{{- define "beep-frontend-files.labels" -}}
helm.sh/chart: beep-frontend-files-{{ .Chart.Version | replace "+" "_" }}
app.kubernetes.io/name: beep-frontend-files
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Chart.AppVersion }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end -}}

{{/* Generate the name of the service account */}}
{{- define "beep-frontend-files.serviceAccountName" -}}
{{- if .Values.serviceAccount.create -}}
{{- default (include "beep-frontend-files.fullname" .) .Values.serviceAccount.name }}
{{- else -}}
{{- default "default" .Values.serviceAccount.name }}
{{- end -}}
{{- end -}}

{{/* Generate the fullname of the chart */}}
{{- define "beep-frontend-files.fullname" -}}
{{- default .Chart.Name .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- end -}}

{{/* Generate the selector labels */}}
{{- define "beep-frontend-files.selectorLabels" -}}
app.kubernetes.io/name: beep-frontend-files
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}
