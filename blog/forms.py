from django import forms


class Blog(forms.Form):
    title = forms.CharField(label='Title', max_length=300)
    details = forms.CharField(widget=forms.Textarea)
    date_created = forms.DateTimeField(label='Date Created')
